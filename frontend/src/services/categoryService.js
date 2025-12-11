import axios from "axios";

export const getCategories = async () => {
    const response = await axios.get("http://localhost:8080/api/service-categories");
    return response.data;
};
