import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient, Diagnosis, Entry } from "../../types";
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

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const HospitalEntry: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div>
      <h3>
        {entry.date} <i className="hospital icon"></i>
      </h3>
      <p>{entry.description}</p>
      <p>
        Discharge: {entry.discharge.date} {entry.discharge.criteria}
      </p>
    </div>
  );
};

const OccupationalHealthcareEntry: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <div>
      <h3>
        {entry.date} <i className="stethoscope icon"></i> {entry.employerName}
      </h3>
      <p>{entry.description}</p>
      {entry.sickLeave && (
        <p>
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </p>
      )}
    </div>
  );
};

const HealthCheckEntry: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <div>
      <h3>
        {entry.date} <i className="user md icon"></i>
      </h3>
      <p>{entry.description}</p>
      <p>Health check rating: {entry.healthCheckRating}</p>
    </div>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
