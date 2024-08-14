import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../../types";
import patientService from "../../services/patients";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return <p>No patient found</p>;
      const patient = await patientService.getPatient(id);
      setPatient(patient);
    };
    void fetchPatient();
  }, [id]);

  return (
    <div>
      <h1>{patient?.name}</h1>
      <p>Gender: {patient?.gender}</p>
      <p>ssn: {patient?.ssn}</p>
      <p>Date of birth: {patient?.dateOfBirth}</p>
      <p>Occupation: {patient?.occupation}</p>
    </div>
  );
};

export default PatientPage;
