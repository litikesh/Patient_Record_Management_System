import { PGliteWorker } from "@electric-sql/pglite/worker";
import { live } from "@electric-sql/pglite/live";
import type { ExecuteQueryResult, PatientData } from "../common/type";

let db: PGliteWorker | null = null;

const initSchema = async (database: PGliteWorker) => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      weight REAL,                 
      height REAL,                 
      blood_group TEXT NOT NULL,            
      blood_pressure TEXT NOT NULL,         
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER,
      medical_notes TEXT,
      insurance_provider TEXT,
      insurance_id TEXT,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.query(`
    CREATE INDEX IF NOT EXISTS idx_patient_name ON patients (last_name, first_name);
  `);
};

export const initDatabase = async (): Promise<PGliteWorker> => {
  if (!db) {
    try {
      const workerInstance = new Worker(
        new URL("../Worker/pglite-worker.ts", import.meta.url),
        {
          type: "module",
        }
      );
      db = new PGliteWorker(workerInstance, {
        extensions: {
          live,
        },
      });
      await initSchema(db);
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return db;
};

export const registerPatient = async (
  patientData: PatientData
): Promise<{ id: number } | { error: string }> => {
  const database = await initDatabase();

  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    weight,
    height,
    blood_group,
    blood_pressure,
    medical_notes,
    insurance_provider,
    insurance_id,
  } = patientData;

  try {
    type PatientIdRow = { id: number };
    const patientResult = await database.query<PatientIdRow>(
      `INSERT INTO patients 
        (first_name, last_name, date_of_birth, gender, phone, address, email, weight, height, blood_group, blood_pressure)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        address,
        email,
        weight ?? null,
        height ?? null,
        blood_group,
        blood_pressure,
      ]
    );

    const patientId = patientResult.rows?.[0]?.id;
    if (!patientId) {
      return { error: "Failed to register patient. Please try again." };
    }

    if (medical_notes || insurance_provider || insurance_id) {
      await addMedicalRecord(
        patientId,
        medical_notes,
        insurance_provider,
        insurance_id
      );
    }

    return { id: patientId };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error registering patient:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      if (error.message.includes("patients.phone")) {
        return {
          error: "Phone number already exists. Please use a different number.",
        };
      }
      if (error.message.includes("patients.email")) {
        return { error: "Email already exists. Please use a different email." };
      }
    }

    return { error: "An error occurred while registering the patient." };
  }
};

export const addMedicalRecord = async (
  patientId: number,
  medical_notes?: string,
  insurance_provider?: string,
  insurance_id?: string
): Promise<{ id: number } | { error: string }> => {
  const database = await initDatabase();

  try {
    type RecordIdRow = { id: number };
    const recordResult = await database.query<RecordIdRow>(
      `INSERT INTO medical_records 
        (patient_id, medical_notes, insurance_provider, insurance_id)
       VALUES
        ($1, $2, $3, $4)
       RETURNING id`,
      [
        patientId,
        medical_notes || null,
        insurance_provider || null,
        insurance_id || null,
      ]
    );

    const recordId = recordResult.rows?.[0]?.id;
    if (!recordId) {
      return { error: "Failed to add medical record" };
    }

    return { id: recordId };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error adding medical record:", error);
    return { error: "An error occurred while adding the medical record" };
  }
};

export const getAllPatients = async (): Promise<PatientData[]> => {
  const database = await initDatabase();
  try {
    const result = await database.query(
      "SELECT * FROM patients ORDER BY created_at DESC"
    );
    return (result.rows as PatientData[]) || [];
  } catch (error) {
    console.error("Error executing getAllPatients query:", error);
    throw error;
  }
};

export const searchPatientsByName = async (
  searchTerm: string
): Promise<PatientData[]> => {
  const database = await initDatabase();
  try {
    const result = await database.query(
      `SELECT * FROM patients
       WHERE first_name ILIKE $1 OR last_name ILIKE $2
       ORDER BY last_name, first_name`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return (result.rows as PatientData[]) || [];
  } catch (error) {
    console.error("Error executing searchPatientsByName query:", error);
    throw error;
  }
};

export const executeQuery = async (
  sqlQuery: string,
  params: unknown[] = []
): Promise<ExecuteQueryResult> => {
  try {
    const database = await initDatabase();
    const result = await database.query(sqlQuery, params);
    return { success: true, data: result.rows || [], error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Query execution error:", error);
    return {
      success: false,
      data: [],
      error: error.message || "An error occurred while executing the query",
    };
  }
};
