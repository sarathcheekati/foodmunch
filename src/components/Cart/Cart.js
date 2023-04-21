import React, { useContext, useState, Fragment } from "react";
import CartContext from "../../store/cart-context";
import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import CheckOut from "./CheckOut";

const Cart = (props) => {
  const [isCheckOut, setIsCheckOut] = useState(false);
  const cartctx = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmitState, setDidSubmitState] = useState(false);
  const totalAmount = `$${cartctx.totalAmount.toFixed(2)}`;
  const hasItems = cartctx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartctx.removeItem(id);
  };
  const cartItemAddHandler = (item) => {
    cartctx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckOut(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    const response = await fetch(
      "https://react-http-e417c-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
      {
        method: "POST",
        body: JSON.stringify({ user: userData, orderedItem: cartctx.items }),
      }
    );

    console.log(response);

    setIsSubmitting(false);
    setDidSubmitState(true);
    cartctx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartctx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && (
        <CheckOut onCancel={props.onClose} onConfirm={submitOrderHandler} />
      )}
      {!isCheckOut && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data ...!</p>;
  const didSubmitModalContent = (
    <Fragment>
      <p>order placed successfully 🍔🍿 </p>
      <div className={classes.actions}>
        <button
          className={classes.button}
          onClick={props.onClose}
          type="button"
        >
          Close
        </button>
      </div>
    </Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmitState && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmitState && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
