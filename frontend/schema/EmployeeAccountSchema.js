import * as Yup from "yup";

const EmployeeAccountSchema = Yup.object().shape({
  firstName: Yup.string().required("First name can't be blank."),
  lastName: Yup.string().required("Last name can't be blank."),
  employeeId: Yup.string().required("Employee ID can't be blank."),
  organization: Yup.string().required("Organization can't be blank."),
  mobileNo: Yup.string().required("Mobile No can't be blank."),
});

export default EmployeeAccountSchema;
