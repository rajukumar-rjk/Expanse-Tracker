import { Container } from "react-bootstrap";
import axios from "axios";
import IItems from "../models/IItems";
import { type } from "os";
const baseUrl = process.env.REACT_APP_BASE_URL;

const getItems = async () => {
  const response = await axios.get<IItems[]>(`${baseUrl}/items`);
  return response.data;
};
const addItem = async (item: Omit<IItems, "id">) => {
  const response = await axios.post<IItems>(`${baseUrl}/items`, item, {
    headers: {
      "Content-type": "application/json",
    },
  });

  return response.data;
};

export { getItems, addItem };
