import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
    try {
        // Revalidate common paths
        revalidatePath('/', 'layout');
        revalidatePath('/bko', 'layout');
        revalidatePath('/novels', 'page');
        revalidatePath('/rankings', 'page');

        return NextResponse.json({
            success: true,
            message: 'Cache limpo com sucesso'
        });
    } catch (error) {
        console.error('Error clearing cache:', error);
        return NextResponse.json({ error: 'Error clearing cache' }, { status: 500 });
    }
}
