import * as Yup from "yup";

const UpdateOrderSchema = Yup.object().shape({
  status: Yup.string(),
  estimatedTime: Yup.number(),
});

export default UpdateOrderSchema;
