import useFormStore from "@/stores/FormStore";

export default function PersonalDetails() {
    const { formData } = useFormStore()
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3 w-full">
      <div className="font-bold pb-3 border-gray-500 border-b-2">Personal Details</div>
      <div className="flex flex-col gap-1 w-full text-gray-500">
        <div className="">Name: {formData.name.value}</div>
        <div className="">Email: {formData.email.value}</div>
        <div className="">Phone: {formData.phone.value}</div>
      </div>
    </div>
  );
}
