import React, { useState } from 'react';
import Link from 'next/link';
import {
  CartPopupBody,
  PopupHeader,
  PopupItemCount,
  CloseButton,
  PromoCode,
  CheckoutButtonWrapper,
  CheckoutButton,
  Title,
  PriceBox,
  NoProductMsg,
  ItemWrapper,
  CouponBoxWrapper,
  CouponCode,
} from './cart.style';
import { CloseIcon } from 'assets/icons/CloseIcon';
import { ShoppingBagLarge } from 'assets/icons/ShoppingBagLarge';
import { CURRENCY } from 'utils/constant';
import { FormattedMessage } from 'react-intl';
import { useLocale } from 'contexts/language/language.provider';
import { Scrollbars } from 'react-custom-scrollbars';
import { useCart } from 'contexts/cart/use-cart';
import { TextCartItem } from 'components/cart-item/text-cart-item';
import Coupon from 'features/coupon/coupon';

type CartPropsType = {
  style?: any;
  className?: string;
  scrollbarHeight?: string;
  onCloseBtnClick?: (e: any) => void;
  onCheckout?: (e: any) => void;
};

const FixedCart: React.FC<CartPropsType> = ({
  style,
  className,
  onCloseBtnClick,
  scrollbarHeight,
  onCheckout,
}) => {
  const {
    items,
    coupon,
    addItem,
    removeItem,
    removeItemFromCart,
    cartItemsCount,
    calculatePrice,
  } = useCart();
  const [hasCoupon, setCoupon] = useState(false);

  const { isRtl } = useLocale();

  return (
    <CartPopupBody className={className} style={style}>
      <PopupHeader>
        <PopupItemCount>
          <ShoppingBagLarge width="19px" height="24px" />
          <span>
            {cartItemsCount}
            &nbsp;
            {cartItemsCount > 1 ? (
              <FormattedMessage id="cartItems" defaultMessage="items" />
            ) : (
              <FormattedMessage id="cartItem" defaultMessage="item" />
            )}
          </span>
        </PopupItemCount>

        <CloseButton onClick={onCloseBtnClick} className="fixedCartClose">
          <CloseIcon />
        </CloseButton>
      </PopupHeader>

      <Scrollbars
        universal
        autoHide
        autoHeight
        autoHeightMax={scrollbarHeight}
        renderView={(props) => (
          <div
            {...props}
            style={{
              ...props.style,
              marginLeft: isRtl ? props.style.marginRight : 0,
              marginRight: isRtl ? 0 : props.style.marginRight,
            }}
          />
        )}
      >
        <ItemWrapper className="items-wrapper">
          {!!cartItemsCount ? (
            items.map((item) => (
              <TextCartItem
                key={`cartItem-${item.id}`}
                onIncrement={() => addItem(item)}
                onDecrement={() => removeItem(item)}
                onRemove={() => removeItemFromCart(item)}
                data={item}
              />
            ))
          ) : (
            <NoProductMsg>
              <FormattedMessage
                id="noProductFound"
                defaultMessage="No products found"
              />
            </NoProductMsg>
          )}
        </ItemWrapper>
      </Scrollbars>

      <CheckoutButtonWrapper>
        <PromoCode>
          {!coupon?.discountInPercent ? (
            <>
              {!hasCoupon ? (
                <button onClick={() => setCoupon((prev) => !prev)}>
                  <FormattedMessage
                    id="specialCode"
                    defaultMessage="Have a special code?"
                  />
                </button>
              ) : (
                <CouponBoxWrapper>
                  <Coupon />
                </CouponBoxWrapper>
              )}
            </>
          ) : (
            <CouponCode>
              <FormattedMessage
                id="couponApplied"
                defaultMessage="Coupon Applied"
              />
              <span>{coupon.code}</span>
            </CouponCode>
          )}
        </PromoCode>

        {cartItemsCount !== 0 ? (
          <Link href="/checkout">
            <CheckoutButton onClick={onCheckout}>
              <>
                <Title>
                  <FormattedMessage
                    id="nav.checkout"
                    defaultMessage="Checkout"
                  />
                </Title>
                <PriceBox>
                  {CURRENCY}
                  {calculatePrice()}
                </PriceBox>
              </>
            </CheckoutButton>
          </Link>
        ) : (
          <CheckoutButton>
            <>
              <Title>
                <FormattedMessage id="nav.checkout" defaultMessage="Checkout" />
              </Title>
              <PriceBox>
                {CURRENCY}
                {calculatePrice()}
              </PriceBox>
            </>
          </CheckoutButton>
        )}
      </CheckoutButtonWrapper>
    </CartPopupBody>
  );
};

export default FixedCart;
