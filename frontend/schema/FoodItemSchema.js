import * as Yup from "yup";

const FoodItemSchema = Yup.object().shape({
  name: Yup.string().required("Food name can't be blank."),
  price: Yup.number("Price has to a number.")
    .required("Price can't be blank.")
    .positive("You are kidding, right?")
    .max(20000, "Do you think they can afford?"),
  category: Yup.string().required("Please, select a category."),
});

export default FoodItemSchema;
