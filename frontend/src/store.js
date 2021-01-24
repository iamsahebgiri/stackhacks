import { createStore, action, thunk } from "easy-peasy";
import axios from "axios";

const store = createStore({
  categories: [],
  addCategory: action((state, payload) => {
    state.categories.push(payload);
  }),
  flushCategories: action((state) => {
    state.categories = [];
  }),
  deleteCategory: action((state, id) => {
    state.categories = state.categories.filter(
      (category) => category.id !== id
    );
  }),
  getAllCategories: thunk((actions, payload) => {
    actions.flushCategories();
    axios
      .get("http://localhost:3030/api/categories")
      .then((response) => {
        const categories = response.data.category;
        categories.map((category) => {
          actions.addCategory(category);
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }),
  foodItems: [],
  flushFoodItems: action((state) => {
    state.foodItems = [];
  }),
  deleteFoodItem: action((state, id) => {
    state.foodItems = state.foodItems.filter((foodItem) => foodItem.id !== id);
  }),
  addFoodItem: action((state, payload) => {
    state.foodItems.push(payload);
  }),
  getAllFoodItems: thunk((actions, payload) => {
    actions.flushFoodItems();
    axios
      .get("http://localhost:3030/api/fooditems")
      .then((response) => {
        const foodItems = response.data.foodItems;
        foodItems.map((foodItem) => {
          actions.addFoodItem(foodItem);
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }),
  getFoodItemsByMe: thunk((actions, payload) => {
    actions.flushFoodItems();
    axios
      .get("http://localhost:3030/api/fooditems/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const foodItems = response.data.foodItems;
        foodItems.map((foodItem) => {
          actions.addFoodItem(foodItem);
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }),
  orders: [],
  flushOrders: action((state) => {
    state.orders = [];
  }),
  deleteOrder: action((state, id) => {
    state.orders = state.orders.filter((order) => order.id !== id);
  }),
  updateOrder: action((state, payload) => {
    state.orders = state.orders.map((order) => {
      if (payload.id === order.id) {
        return {
          ...order,
          status: payload.status,
          estimatedTime: `${payload.estimatedTime} min`,
        };
      }
      return order;
    });
  }),
  addOrder: action((state, payload) => {
    state.orders.push(payload);
  }),
  getAllOrders: thunk((actions, payload) => {
    actions.flushOrders();
    axios
      .get("http://localhost:3030/api/orders")
      .then((response) => {
        const orders = response.data.orders;
        orders.map((order) => {
          actions.addOrder({
            foodItem: order.item.name,
            orderedBy: order.whoOrdered.username,
            status: order.status,
            estimatedTime: `${order.estimatedTime} min`,
            id: order._id,
          });
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }),
  getOrdersByMe: thunk((actions, payload) => {
    actions.flushOrders();
    axios
      .get("http://localhost:3030/api/orders/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const orders = response.data.orders;
        console.log(response.data.orders);
        orders.map((order) => {
          actions.addOrder(order);
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }),
  getAllOrdersByAdmin: thunk((actions, payload) => {
    actions.flushOrders();
    axios
      .get("http://localhost:3030/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const orders = response.data.orders;
        console.log(response.data.orders);
        orders.map((order) => {
          actions.addOrder({
            foodItem: order.item.name,
            orderedBy:
              order.whoOrdered.name !== undefined
                ? order.whoOrdered.name
                : order.whoOrdered.username,
            status: order.status,
            estimatedTime: `${order.estimatedTime} min`,
            id: order._id,
          });
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }),
  user: {},
  flushUser: action((state) => {
    state.user = {};
  }),
  addUser: action((state, payload) => {
    state.user = payload;
  }),
  getUser: thunk((actions, payload) => {
    actions.flushUser();
    axios
      .get("http://localhost:3030/api/users/account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data.user);
        localStorage.setItem("token", response.data.user.token);
        actions.addUser(response.data.user);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }),
});

export default store;
