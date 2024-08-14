import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient, Diagnosis } from "../../types";
import patientService from "../../services/patients";
import diagnosesService from "../../services/diagnoses";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return <p>No patient found</p>;
      const patient = await patientService.getPatient(id);
      setPatient(patient);
    };
    void fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnoses();
  }, []);

  return (
    <div>
      <h1>{patient?.name}</h1>
      <p>Gender: {patient?.gender}</p>
      <p>ssn: {patient?.ssn}</p>
      <p>Date of birth: {patient?.dateOfBirth}</p>
      <p>Occupation: {patient?.occupation}</p>
      <h4>Entries</h4>
      {patient?.entries.map((entry) => (
        <div key={entry.id}>
          <p>
            {entry.date} {entry.description}
          </p>
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>
                {code}{" "}
                {diagnoses.find((diagnosis) => diagnosis.code === code)?.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
