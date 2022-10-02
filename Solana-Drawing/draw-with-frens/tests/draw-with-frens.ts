import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import { DrawWithFrens } from "../target/types/draw_with_frens";
import { assert } from "chai"

describe("draw-with-frens", () => {
  const anchorProvider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DrawWithFrens as Program<DrawWithFrens>;

  it("Creates pixel", async () => {
    const x = 10;
    const y = 10;

    const [pixelPublicKey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pixel"), Buffer.from([x, y])],
      program.programId,
    )

    await program.methods
      .createPixel(x, y, 0, 0, 255)
      .accounts({
        pixel: pixelPublicKey,
        user: anchorProvider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    const storedPixel = await program.account.pixel.fetch(pixelPublicKey)
    assert.equal(storedPixel.posX, 10)
    assert.equal(storedPixel.posY, 10)
    assert.equal(storedPixel.colR, 0)
    assert.equal(storedPixel.colG, 0)
    assert.equal(storedPixel.colB, 255)
  });

  it("Does not create pixel out of bounds", async () => {
    const x = 0;
    const y = 200;
    const [pixelPublicKey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pixel"), Buffer.from([x, y])],
      program.programId,
    )

    await program.methods
      .createPixel(x, y, 0, 0, 255)
      .accounts({
        pixel: pixelPublicKey,
        user: anchorProvider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()
      .then(
        () => Promise.reject(new Error("Should not work")),
        (e: AnchorError) => {
          assert.ok(e.errorLogs.some(log => log.includes('InvalidYCoordinate') && log.includes('The given Y co-ordinate is not between 0-99')))
        }
      );
  })

  it("Does not allow creating the same pixel twice", async () => {
    const x = 20;
    const y = 20;

    const [pixelPublicKey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pixel"), Buffer.from([x, y])],
      program.programId,
    )

    await program.methods
    .createPixel(x, y, 0, 0, 255)
    .accounts({
      pixel: pixelPublicKey,
      user: anchorProvider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc()

    await program.methods
      .createPixel(x, y, 0, 0, 255)
      .accounts({
        pixel: pixelPublicKey,
        user: anchorProvider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .postInstructions([
        web3.SystemProgram.transfer({
          fromPubkey: anchorProvider.wallet.publicKey,
          toPubkey: anchorProvider.wallet.publicKey,
          lamports: 1,
        })
      ])
      .rpc()
      .then(
        () => Promise.reject(new Error('Expected to error!')),
        (e: web3.SendTransactionError) => {
          assert.ok(e.logs.some(log => log.includes(pixelPublicKey.toBase58()) && log.includes('already in use')))
        }
      )
  })

  it("Does not allow passing an incorrect address", async () => {
    const [pixelPublicKey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pixel"), Buffer.from([0, 0])],
      program.programId,
    )

    await program.methods
    .createPixel(30, 30, 0, 0, 255)
    .accounts({
      pixel: pixelPublicKey,
      user: anchorProvider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc()
    .then(
      () => Promise.reject(new Error('Expected to error!')),
      (e: web3.SendTransactionError) => {
        const expectedError = `${pixelPublicKey.toBase58()}'s signer privilege escalated`
        assert.ok(e.logs.some(log => log === expectedError))
      }
    )
  })

  it("Can update a created pixel", async () => {
    const x = 40;
    const y = 40;
    
    const [pixelPublicKey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pixel"), Buffer.from([0, 0])],
      program.programId,
    )

    await program.methods
      .createPixel(x, y, 0, 0, 255)
      .accounts({
        pixel: pixelPublicKey,
        user: anchorProvider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()
    
    await program.methods
      .updatePixel(255, 0, 0)
      .accounts({
        pixel: pixelPublicKey,
      })
      .rpc()
    
      const storedPixel = await program.account.pixel.fetch(pixelPublicKey)
      assert.equal(storedPixel.posX, x)
      assert.equal(storedPixel.posY, y)
      assert.equal(storedPixel.colR, 255)
      assert.equal(storedPixel.colG, 0)
      assert.equal(storedPixel.colB, 0)
  })

  it("Emits an event when a pixel is created", async () => {
    let events = [];
    const listener = program.addEventListener('PixelChanged', (event: any) => {
      events.push(event)
    })

    const x = 50
    const y = 50

    const [pixelPublicKey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pixel"), Buffer.from([x, y])],
      program.programId,
    )
    
    await program.methods
      .createPixel(x, y, 0, 0, 255)
      .accounts({
        pixel: pixelPublicKey,
        user: anchorProvider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

      assert.equal(events.length, 1)
      const event = events[0];

      assert.equal(event.posX, x)
      assert.equal(event.posY, y)
      assert.equal(event.colR, 0)
      assert.equal(event.colG, 0)
      assert.equal(event.colB, 255)

      program.removeEventListener(listener)
  })

  it("Emits an event when a pixel is updated", async () => {
    let events = [];
    const listener = program.addEventListener('PixelChanged', (event: any) => {
      events.push(event)
    })

    const x = 50
    const y = 50

    const [pixelPublicKey] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pixel"), Buffer.from([x, y])],
      program.programId,
    )
    
    await program.methods
      .updatePixel(255, 0, 0)
      .accounts({
        pixel: pixelPublicKey,
      })
      .rpc()

      assert.equal(events.length, 1)
      const event = events[0];

      assert.equal(event.posX, x)
      assert.equal(event.posY, y)
      assert.equal(event.colR, 255)
      assert.equal(event.colG, 0)
      assert.equal(event.colB, 0)

      program.removeEventListener(listener)
  })
});
