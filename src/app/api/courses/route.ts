import { NextResponse } from 'next/server'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { getFirestoreDb } from '@/lib/firebase'
import { loadCourses } from '@/lib/courses'

// Get all courses (public endpoint used by the Services page)
export async function GET() {
  try {
    const db = getFirestoreDb()
    if (!db) {
      return NextResponse.json([])
    }
    const snap = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'asc')))
    const courses = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
    return NextResponse.json(courses)
  } catch {
    // Fallback: use shared loader
    const courses = await loadCourses()
    return NextResponse.json(courses)
  }
}
