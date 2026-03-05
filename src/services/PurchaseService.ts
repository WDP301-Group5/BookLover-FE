import axios from "axios";
import { instance } from "../lib/axios";
import socket from "../lib/socket";

const PurchaseService = {
  async createOrder(amount: number, description: string) {
    try {
      const response = await instance
        .post("/order/zalopay/create", {
          amount,
          description,
        })
        .then((res) => res?.data || {})
        .catch((err) => {
          console.error("Error creating order:", err);
          throw err;
        });
      // gọi socket join room
      socket.emit("join_purchase_room", response?.data?.app_trans_id);
      // return data
      return response?.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async callOrderURL(order_url: string) {
    try {
      const response = await axios
        .get(order_url)
        .then((res) => res?.data || {})
        .catch((err) => {
          console.error("Error fetching order status:", err);
          throw err;
        });
      console.log("get from order_url", response);
      return response;
    } catch (error) {
      console.error("Error fetching order status:", error);
      throw error;
    }
  },
};

export default PurchaseService;
