'use server'
import * as y from 'yup';
import { cookies } from "next/headers"
import { createClient } from '@/lib/supabase/server';

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
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.from("email_notification_list").insert({
      email: rawFormData.email,
      pending_feature: rawFormData.feature
    })
    if (error !== null) throw "";
  } catch (e) {
    return {
      ...prevState,
      success: false,
      message: "unkown server error"
    }
  }

  // retrun if success
  return {
    ...prevState,
    success: true,
    message: "Email Submited  ✅"
  }

}
