import {
  MastercardFlatRoundedIcon,
  VisaFlatRoundedIcon,
} from "react-svg-credit-card-payment-icons";

/**
 * Card scheme marks, from `react-svg-credit-card-payment-icons` — the real
 * brand artwork rather than something traced by hand.
 *
 * Only the schemes Creem's checkout can actually charge. Apple Pay and Google
 * Pay are offered too, but only on supported devices and their brand marks
 * have usage rules of their own, so they are named in text instead of shown
 * as a logo we do not have the official asset for.
 */
export function PaymentMarks({ className }: { className?: string }) {
  return (
    <ul className={className}>
      <li>
        <VisaFlatRoundedIcon
          role="img"
          aria-label="Visa"
          className="h-8 w-auto"
        />
      </li>
      <li>
        <MastercardFlatRoundedIcon
          role="img"
          aria-label="Mastercard"
          className="h-8 w-auto"
        />
      </li>
    </ul>
  );
}
