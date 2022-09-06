(define-fungible-token nazgul-gold)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-amount-zero (err u101))

(define-public (mint (amount uint) (who principal))
    (begin 
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (> amount u0) err-amount-zero)
        ;; #[allow(unchecked_data)]
        (ft-mint? nazgul-gold amount who)
    )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-owner-only)
        (asserts! (> amount u0) err-amount-zero)
        ;; #[allow(unchecked_data)]
        (ft-transfer? nazgul-gold amount sender recipient)
    )
)

(define-read-only (get-balance (who principal))
    (ft-get-balance nazgul-gold who)
)