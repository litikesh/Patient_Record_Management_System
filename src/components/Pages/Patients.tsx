import React, { useState } from "react";
import type { PatientFormData } from "../common/type";
import { useDatabaseContext } from "../Context/DatabaseContext";
import { registerPatient } from "../Services/DBServices";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  FileText,
  Save,
  User,
} from "lucide-react";

const initialFormState: PatientFormData = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  weight: 0.0,
  height: 0.0,
  blood_group: "",
  blood_pressure: 0,
  medical_notes: "",
  insurance_provider: "",
  insurance_id: "",
};

const Patients: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>(initialFormState);

  const { broadcastAction } = useDatabaseContext();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const result = await registerPatient(formData);
      if (result && "id" in result) {
        toast.success("Patient successfully registered");
        broadcastAction({
          type: "PATIENT_ADDED",
          payload: { ...formData, id: result.id },
          timestamp: Date.now(),
        });
        setFormData(initialFormState);
        setActiveTab(1);
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const validateTab = () => {
    if (activeTab === 1) {
      const requiredFields = [
        "first_name",
        "last_name",
        "date_of_birth",
        "gender",
        "phone",
        "email",
        "address",
      ];

      return requiredFields.every((field) =>
        Boolean(formData[field as keyof PatientFormData])
      );
    }

    if (activeTab === 2) {
      const requiredFields = [
        "height",
        "weight",
        "blood_group",
        "blood_pressure",
      ];

      return requiredFields.every((field) =>
        Boolean(formData[field as keyof PatientFormData])
      );
    }

    return true;
  };

  const nextTab = () => {
    if (validateTab()) {
      setActiveTab((prev) => Math.min(prev + 1, 3));
    } else {
      toast.error("Please complete all required fields.");
    }
  };

  const prevTab = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  return (
    <div className="mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Patient Registration
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Please fill out the form below to register a new patient
        </p>
      </div>

      <div className="flex mb-6 border-b border-slate-200">
        <div
          className={`py-3 px-4 font-medium text-sm flex items-center gap-2 ${
            activeTab === 1
              ? "text-gray-600 border-b-2 border-gray-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <User className="w-4 h-4" />
          Personal
        </div>
        <div
          className={`py-3 px-4 font-medium text-sm flex items-center gap-2 ${
            activeTab === 2
              ? "text-gray-600 border-b-2 border-gray-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          Medical
        </div>
        <div
          className={`py-3 px-4 font-medium text-sm flex items-center gap-2 ${
            activeTab === 3
              ? "text-gray-600 border-b-2 border-gray-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Insurance
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6">
            {activeTab === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      First Name&nbsp;<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Last Name&nbsp;<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date_of_birth"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Date of Birth&nbsp;
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="date_of_birth"
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Format: MM/DD/YYYY
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Gender&nbsp;<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Phone Number&nbsp;
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="+91 1234567890"
                      pattern="^[0-9]{10}$"
                      maxLength={10}
                      minLength={10}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email&nbsp;
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Address&nbsp;
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Street address, city, state, zip code"
                  ></textarea>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Height (cm)&nbsp;
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="height"
                      type="number"
                      name="height"
                      required
                      value={formData.height}
                      onChange={handleInputChange}
                      step="0.01"
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="170"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="weight"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Weight (kg)&nbsp;
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="weight"
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="70"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="blood_group"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Blood Group&nbsp;
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="blood_group"
                      name="blood_group"
                      value={formData.blood_group}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="blood_pressure"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Blood Pressure&nbsp;
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="blood_pressure"
                      type="text"
                      name="blood_pressure"
                      value={formData.blood_pressure}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="120/80"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="medical_notes"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Medical Notes
                  </label>
                  <textarea
                    id="medical_notes"
                    name="medical_notes"
                    value={formData.medical_notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Allergies, chronic conditions, current medications, etc."
                  ></textarea>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label
                      htmlFor="insurance_provider"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Insurance Provider
                    </label>
                    <input
                      id="insurance_provider"
                      type="text"
                      name="insurance_provider"
                      value={formData.insurance_provider}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="Insurance company name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="insurance_id"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Insurance ID
                    </label>
                    <input
                      id="insurance_id"
                      type="text"
                      name="insurance_id"
                      value={formData.insurance_id}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2.5 text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="Policy number"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center bg-slate-50 px-5 md:px-6 py-4 border-t border-slate-200">
            <button
              type="button"
              onClick={prevTab}
              disabled={activeTab === 1}
              className={`inline-flex items-center px-4 py-2 rounded text-sm font-medium cursor-pointer ${
                activeTab === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Previous
            </button>

            {activeTab < 3 ? (
              <button
                type="button"
                onClick={nextTab}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-700 cursor-pointer"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitForm}
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 rounded text-sm font-medium cursor-pointer ${
                  isSubmitting
                    ? "bg-green-500 text-white cursor-not-allowed opacity-70"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isSubmitting ? "Registering..." : "Register Patient"}
                <Save className="w-4 h-4 ml-1.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Patients;
