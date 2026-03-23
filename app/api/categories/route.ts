import { NextResponse } from 'next/server';
import { CategoryService } from '@/lib/models';

export async function GET() {
  try {
    const categories = await CategoryService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
