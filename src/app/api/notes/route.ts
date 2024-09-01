import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('Attempting to fetch notes...')
    const notes = await prisma.note.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    console.log('Notes fetched successfully:', notes)
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Error fetching notes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content } = body
    console.log('Attempting to create note:', { title, content })
    const note = await prisma.note.create({
      data: {
        title,
        content,
      },
    })
    console.log('Note created successfully:', note)
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Error creating note' }, { status: 500 })
  }
}