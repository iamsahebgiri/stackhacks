import * as Yup from "yup";

const StoreAccountSchema = Yup.object().shape({
  storeName: Yup.string().required("Store name can't be blank."),
  shortDescription: Yup.string().required("Description can't be blank."),
});

export default StoreAccountSchema;