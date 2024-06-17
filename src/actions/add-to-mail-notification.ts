'use server'
import * as y from 'yup';

const formSchema = y.object({
  email: y.string().email().required(),
  feature: y.string().required(),
});

export async function addToMailNotification(prevState: any, formData: FormData) {

  // extract data form the form
  const rawFormData = {
    email: formData.get('email'),
    feature: formData.get('feature'),
  }

  // validate the data
  try {
    await formSchema.validate(rawFormData)
  } catch (e: any) {
    return {
      ...prevState,
      success: false,
      message: e?.errors?.[0] ?? "unkown validation error"
    }
  }

  // send the data to the backend


  // retrun if success
  return {
    ...prevState,
    success: true,
    message: "email added"
  }

}
