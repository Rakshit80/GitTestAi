import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";          // or wherever your db is defined
import { users } from "@/db/schema"; 
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";

    // Check if user has a pro subscription in Clerk publicMetadata
    const publicMetadata = user.publicMetadata || {};
    const isSubscriber = 
      publicMetadata.role === "pro" || 
      publicMetadata.tier === "pro" || 
      publicMetadata.subscriptionStatus === "active" ||
      publicMetadata.stripeSubscriptionStatus === "active" ||
      (publicMetadata.subscription && 
        typeof publicMetadata.subscription === "object" && 
        (publicMetadata.subscription as any).status === "active");

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));

    if (userResult.length === 0) {
      const initialCredits = isSubscriber ? 10000 : 1000;
      const newUser = await db
        .insert(users)
        .values({
          email: userEmail,
          name: user.fullName ?? "New User",
          credits: initialCredits,
        })
        .returning();

      return NextResponse.json({ user: newUser[0] });
    } else {
      let dbUser = userResult[0];

      // If they upgraded to a subscriber but their database credits are still at free trial level (< 10000), upgrade them to 10000 credits.
      if (isSubscriber && dbUser.credits < 10000) {
        const updated = await db
          .update(users)
          .set({ credits: 10000 })
          .where(eq(users.id, dbUser.id))
          .returning();
        dbUser = updated[0];
      }

      return NextResponse.json({ user: dbUser });
    }
  } catch (e) {
    console.log("error creating User:", e);
    return NextResponse.json(
      { error: "failed to create new user" },
      { status: 500 }
    );
  }
}