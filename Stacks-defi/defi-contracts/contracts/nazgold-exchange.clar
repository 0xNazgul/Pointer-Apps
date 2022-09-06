(define-constant err-zero-stx (err u200))
(define-constant err-zero-tokens (err u201))

(define-constant fee-basis-points u30)

(define-read-only (get-stx-balance)
  (stx-get-balance (as-contract tx-sender))
)

(define-read-only (get-token-balance)
    (contract-call? .nazgul-gold get-balance (as-contract tx-sender))
)

(define-private (provide-liquidity-first (stx-amount uint) (token-amount uint) (provider principal))
    (begin
        (try! (stx-transfer? stx-amount tx-sender (as-contract tx-sender)))
        (try! (contract-call? .nazgul-gold transfer token-amount tx-sender (as-contract tx-sender)))
        (as-contract (contract-call? .nazgul-gold-lp mint stx-amount provider))
    )
)

(define-private (provide-liquidity-additional (stx-amount uint))
  	(let (
      	(contract-address (as-contract tx-sender))
		(stx-balance (get-stx-balance))
      	(token-balance (get-token-balance))
      	(tokens-to-transfer (/ (* stx-amount token-balance) stx-balance))
		(liquidity-token-supply (contract-call? .nazgul-gold-lp get-total-supply))
		(liquidity-to-mint (/ (* stx-amount liquidity-token-supply) stx-balance))
		(provider tx-sender)
    )
    	(begin 
      		(try! (stx-transfer? stx-amount tx-sender contract-address))
      		(try! (contract-call? .nazgul-gold transfer tokens-to-transfer tx-sender contract-address))
      		(as-contract (contract-call? .nazgul-gold-lp mint liquidity-to-mint provider))
    	)
  	)
)

(define-public (provide-liquidity (stx-amount uint) (max-token-amount uint))
    (begin
        (asserts! (> stx-amount u0) err-zero-stx)
        (asserts! (> max-token-amount u0) err-zero-tokens)
        
		(if (is-eq (get-stx-balance) u0)
			(provide-liquidity-first stx-amount max-token-amount tx-sender)
			(provide-liquidity-additional stx-amount)
		)
    )
)

(define-public (stx-to-token-swap (stx-amount uint))
  	(begin 
    	(asserts! (> stx-amount u0) err-zero-stx)
    
    	(let (
      		(stx-balance (get-stx-balance))
      		(token-balance (get-token-balance))
		    (constant (* stx-balance token-balance))
			(fee (/ (* stx-amount fee-basis-points) u10000))
      		(new-stx-balance (+ stx-balance stx-amount))
			(new-token-balance (/ constant (- new-stx-balance fee)))
      		(tokens-to-pay (- token-balance new-token-balance))
      		(user-address tx-sender)
      		(contract-address (as-contract tx-sender))
    	)
      		(begin
        		(try! (stx-transfer? stx-amount user-address contract-address))
        		(as-contract (contract-call? .nazgul-gold transfer tokens-to-pay contract-address user-address))
      		)
    	)
  	)
)

(define-public (token-to-stx-swap (token-amount uint))
  	(begin 
    	(asserts! (> token-amount u0) err-zero-tokens)
    
    	(let (
      		(stx-balance (get-stx-balance))
      		(token-balance (get-token-balance))
      		(constant (* stx-balance token-balance))
      		(fee (/ (* token-amount fee-basis-points) u10000))
      		(new-token-balance (+ token-balance token-amount))
      		(new-stx-balance (/ constant (- new-token-balance fee)))
      		(stx-to-pay (- stx-balance new-stx-balance))
      		(user-address tx-sender)
      		(contract-address (as-contract tx-sender))
    	)
      		(begin
        		(print fee)
        		(print new-token-balance)
        		(print (- new-token-balance fee))
        		(print new-stx-balance)
        		(print stx-to-pay)
        		(try! (contract-call? .nazgul-gold transfer token-amount user-address contract-address))
        		(as-contract (stx-transfer? stx-to-pay contract-address user-address))
      		)
    	)
  	)
)

(define-public (remove-liquidity (liquidity-burned uint))
  	(begin
    	(asserts! (> liquidity-burned u0) err-zero-tokens)

      	(let (
        	(stx-balance (get-stx-balance))
        	(token-balance (get-token-balance))
        	(liquidity-token-supply (contract-call? .nazgul-gold-lp get-total-supply))
        	(stx-withdrawn (/ (* stx-balance liquidity-burned) liquidity-token-supply))
        	(tokens-withdrawn (/ (* token-balance liquidity-burned) liquidity-token-supply))

        	(contract-address (as-contract tx-sender))
        	(burner tx-sender)
      	)
      		(begin 
        		(try! (contract-call? .nazgul-gold-lp burn liquidity-burned))
        		(try! (as-contract (stx-transfer? stx-withdrawn contract-address burner)))
        		(as-contract (contract-call? .nazgul-gold transfer tokens-withdrawn contract-address burner))
      		)
    	)
  	)
)