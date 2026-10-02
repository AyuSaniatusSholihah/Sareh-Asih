/**
 * firestore-students.ts
 * Service untuk mengelola data siswa di Firebase Firestore.
 * - Menyimpan siswa baru ke koleksi "students"
 * - Memuat semua siswa dari koleksi "students"
 * - Memperbarui data siswa (hasObs, kodeOrtu, dll)
 */
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { Student } from "./data";

const STUDENTS_COLLECTION = "students";

/** Simpan satu siswa baru ke Firestore */
export async function saveStudentToFirestore(student: Student): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id.toString());
    // Firestore tidak mendukung undefined, kita bersihkan datanya
    const cleanStudent = JSON.parse(JSON.stringify(student));
    await setDoc(docRef, cleanStudent);
  } catch (err) {
    console.error("Gagal menyimpan siswa ke Firestore:", err);
    throw err;
  }
}

/** Muat semua siswa dari Firestore */
export async function loadStudentsFromFirestore(): Promise<Student[]> {
  try {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy("id", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((d) => d.data() as Student);
  } catch (err) {
    console.error("Gagal memuat siswa dari Firestore:", err);
    return [];
  }
}

/** Perbarui sebagian field siswa di Firestore (misal: hasObs, kodeOrtu) */
export async function updateStudentInFirestore(
  studentId: number,
  updates: Partial<Student>
): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId.toString());
    const cleanUpdates = JSON.parse(JSON.stringify(updates));
    await updateDoc(docRef, cleanUpdates);
  } catch (err) {
    console.error("Gagal memperbarui siswa di Firestore:", err);
    throw err;
  }
}

/** Hapus siswa dari Firestore */
export async function deleteStudentFromFirestore(studentId: number): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId.toString());
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Gagal menghapus siswa dari Firestore:", err);
    throw err;
  }
}
