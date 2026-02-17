import React from "react";
import axios from "axios";

export default function Checkout() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    await axios.post("/api/orders/create", payload);
  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Оформление заказа</h1>
      <input name="name" placeholder="Имя" required />
      <input name="phone" placeholder="Телефон" required />
      <input name="address" placeholder="Адрес" required />
      <button type="submit">Заказать</button>
    </form>
  );
}
