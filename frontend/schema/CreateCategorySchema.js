import * as Yup from "yup";

const CreateCategorySchema = Yup.object().shape({
  name: Yup.string().required("Name can't be blank."),
});

export default CreateCategorySchema;
