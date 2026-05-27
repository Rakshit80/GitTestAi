import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { TestCasesTable } from "@/db/schema";
export async function POST(req: NextRequest) {
    const { title, description, targetRoute, expectedResult, testcaseId } = await req.json()
    const result = await db.update(TestCasesTable).set({
        title,
        description,
        targetRoute,
        expectedResult
    }).where(eq(TestCasesTable.id, testcaseId)).returning();
    return NextResponse.json(result[0])

}

