(define-fungible-token nazgul-gold-lp)

(define-constant err-minter-only (err u300))
(define-constant err-amount-zero (err u301))

(define-data-var allowed-minter principal tx-sender)

(define-read-only (get-total-supply)
    (ft-get-supply nazgul-gold-lp)
)

(define-public (set-minter (who principal))
    (begin
        (asserts! (is-eq tx-sender (var-get allowed-minter)) err-minter-only)
        ;; #[allow(unchecked_data)]
        (ok (var-set allowed-minter who))
    )
)

(define-public (mint (amount uint) (who principal))
    (begin
        (asserts! (is-eq tx-sender (var-get allowed-minter)) err-minter-only)
        (asserts! (> amount u0) err-amount-zero)
        ;; #[allow(unchecked_data)]
        (ft-mint? nazgul-gold-lp amount who)
    )
)

(define-public (burn (amount uint))
    (ft-burn? nazgul-gold-lp amount tx-sender)
)

(define-read-only (get-decimals) 
    (ok u6)
)

(define-read-only (get-symbol)
    (ok "Nazgold-LP")
)