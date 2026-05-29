import { AuthProvider } from "../src/generated/prisma/client";
import { prisma } from "./db";
import { password } from "bun";

async function main() {
  console.log("🌱 Seeding database...");

  // ─────────────────────────────────────────
  // CLEAR EXISTING DATA (urutan penting!)
  // ─────────────────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // ─────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────
  const passwordHash = await password.hash("password123", {
    algorithm: "bcrypt",
    cost: 10,
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Johnson",
        username: "alice_j",
        email: "alice@example.com",
        password: passwordHash,
        bio: "Software engineer & coffee lover ☕",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        provider: AuthProvider.EMAIL,
        email_verified_at: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Smith",
        username: "bob_smith",
        email: "bob@example.com",
        password: passwordHash,
        bio: "UI/UX Designer | Minimalist 🎨",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        provider: AuthProvider.EMAIL,
        email_verified_at: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Clara Tan",
        username: "clara_tan",
        email: "clara@example.com",
        password: passwordHash,
        bio: "Data scientist. Python enthusiast 🐍",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=clara",
        provider: AuthProvider.EMAIL,
        email_verified_at: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "David Kim",
        username: "david_kim",
        email: "david@example.com",
        password: passwordHash,
        bio: "Full-stack dev | Open source contributor",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        provider: AuthProvider.EMAIL,
        email_verified_at: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Eva Google User",
        username: "eva_google",
        email: "eva@gmail.com",
        password: null, // OAuth-only user
        bio: "Product manager | Google OAuth user",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=eva",
        provider: AuthProvider.GOOGLE,
        provider_id: "google_oauth_id_12345",
        email_verified_at: new Date(),
      },
    }),
  ]);

  const [alice, bob, clara, david, eva] = users;
  console.log(`✅ Created ${users.length} users`);

  // ─────────────────────────────────────────
  // POSTS
  // ─────────────────────────────────────────
  const posts = await Promise.all([
    // Alice's posts
    prisma.post.create({
      data: {
        user_id: alice.id,
        content:
          "Baru saja deploy project pertama saya menggunakan Bun + Prisma v7. Performanya luar biasa! 🚀 Ada yang sudah coba?",
      },
    }),
    prisma.post.create({
      data: {
        user_id: alice.id,
        content:
          "Tips: Selalu tulis unit test sebelum menulis fitur baru. Test-driven development benar-benar mengubah cara saya coding.",
        image_url: "https://picsum.photos/seed/tdd/800/400",
      },
    }),

    // Bob's posts
    prisma.post.create({
      data: {
        user_id: bob.id,
        content:
          "Design system yang baik bukan tentang seberapa indah tampilannya, tapi seberapa konsisten dan mudah digunakan oleh tim.",
        image_url: "https://picsum.photos/seed/design/800/400",
      },
    }),
    prisma.post.create({
      data: {
        user_id: bob.id,
        content:
          "Figma vs Sketch di 2025 — menurut kalian mana yang lebih worth it untuk tim kecil?",
      },
    }),

    // Clara's posts
    prisma.post.create({
      data: {
        user_id: clara.id,
        content:
          "Machine learning bukan sihir. Ini matematika + data + banyak trial and error. Jangan takut mulai dari yang kecil! 📊",
      },
    }),
    prisma.post.create({
      data: {
        user_id: clara.id,
        content:
          "Pandas vs Polars untuk data processing — Polars jauh lebih cepat untuk dataset besar. Highly recommend untuk dicoba!",
        image_url: "https://picsum.photos/seed/data/800/400",
      },
    }),

    // David's posts
    prisma.post.create({
      data: {
        user_id: david.id,
        content:
          "Open source is not just about code. It's about community, documentation, and empathy for contributors.",
      },
    }),

    // Eva's posts
    prisma.post.create({
      data: {
        user_id: eva.id,
        content:
          "Product roadmap Q3 sudah selesai! Excited dengan fitur-fitur baru yang akan kita ship bulan ini 🎯",
      },
    }),
  ]);

  const [
    alicePost1,
    alicePost2,
    bobPost1,
    bobPost2,
    claraPost1,
    claraPost2,
    davidPost1,
    evaPost1,
  ] = posts;

  console.log(`✅ Created ${posts.length} posts`);

  // ─────────────────────────────────────────
  // POST LIKES
  // ─────────────────────────────────────────
  const likes = await Promise.all([
    // Likes on Alice's post 1
    prisma.postLike.create({
      data: { post_id: alicePost1.id, user_id: bob.id },
    }),
    prisma.postLike.create({
      data: { post_id: alicePost1.id, user_id: clara.id },
    }),
    prisma.postLike.create({
      data: { post_id: alicePost1.id, user_id: david.id },
    }),
    prisma.postLike.create({
      data: { post_id: alicePost1.id, user_id: eva.id },
    }),

    // Likes on Alice's post 2
    prisma.postLike.create({
      data: { post_id: alicePost2.id, user_id: bob.id },
    }),
    prisma.postLike.create({
      data: { post_id: alicePost2.id, user_id: clara.id },
    }),

    // Likes on Bob's post 1
    prisma.postLike.create({
      data: { post_id: bobPost1.id, user_id: alice.id },
    }),
    prisma.postLike.create({
      data: { post_id: bobPost1.id, user_id: clara.id },
    }),
    prisma.postLike.create({ data: { post_id: bobPost1.id, user_id: eva.id } }),

    // Likes on Bob's post 2
    prisma.postLike.create({
      data: { post_id: bobPost2.id, user_id: alice.id },
    }),
    prisma.postLike.create({
      data: { post_id: bobPost2.id, user_id: david.id },
    }),

    // Likes on Clara's post 1
    prisma.postLike.create({
      data: { post_id: claraPost1.id, user_id: alice.id },
    }),
    prisma.postLike.create({
      data: { post_id: claraPost1.id, user_id: bob.id },
    }),
    prisma.postLike.create({
      data: { post_id: claraPost1.id, user_id: david.id },
    }),

    // Likes on Clara's post 2
    prisma.postLike.create({
      data: { post_id: claraPost2.id, user_id: alice.id },
    }),
    prisma.postLike.create({
      data: { post_id: claraPost2.id, user_id: eva.id },
    }),

    // Likes on David's post
    prisma.postLike.create({
      data: { post_id: davidPost1.id, user_id: alice.id },
    }),
    prisma.postLike.create({
      data: { post_id: davidPost1.id, user_id: bob.id },
    }),
    prisma.postLike.create({
      data: { post_id: davidPost1.id, user_id: clara.id },
    }),

    // Likes on Eva's post
    prisma.postLike.create({
      data: { post_id: evaPost1.id, user_id: alice.id },
    }),
    prisma.postLike.create({ data: { post_id: evaPost1.id, user_id: bob.id } }),
  ]);

  console.log(`✅ Created ${likes.length} post likes`);

  // ─────────────────────────────────────────
  // COMMENTS
  // ─────────────────────────────────────────

  // Comments on Alice's post 1
  const comment1 = await prisma.comment.create({
    data: {
      post_id: alicePost1.id,
      user_id: bob.id,
      content:
        "Wah keren! Bun memang jauh lebih cepat dari Node.js. Setup-nya mudah tidak?",
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      post_id: alicePost1.id,
      user_id: clara.id,
      content:
        "Saya juga lagi explore Bun. Prisma v7 support native bun runtime ya?",
    },
  });

  // Replies to comment1 (Bob's comment)
  const reply1ToComment1 = await prisma.comment.create({
    data: {
      post_id: alicePost1.id,
      user_id: alice.id,
      parent_comment_id: comment1.id,
      content:
        "Setup-nya cukup mudah! Tinggal install Bun lalu `bun install`. Prisma v7 juga sudah support native 🙌",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: alicePost1.id,
      user_id: david.id,
      parent_comment_id: comment1.id,
      content:
        "Setuju, ekosistemnya makin matang. Coba juga Elysia.js untuk framework-nya!",
    },
  });

  // Reply to reply (nested thread)
  await prisma.comment.create({
    data: {
      post_id: alicePost1.id,
      user_id: bob.id,
      parent_comment_id: reply1ToComment1.id,
      content: "Oh nice, berarti tidak perlu config tambahan ya. Thanks Alice!",
    },
  });

  // Replies to comment2 (Clara's comment)
  await prisma.comment.create({
    data: {
      post_id: alicePost1.id,
      user_id: alice.id,
      parent_comment_id: comment2.id,
      content:
        "Iya! Prisma v7 sudah ada runtime bun. Tinggal set di generator client.",
    },
  });

  // Comments on Bob's post 1
  const comment3 = await prisma.comment.create({
    data: {
      post_id: bobPost1.id,
      user_id: alice.id,
      content:
        "Sangat setuju! Design system yang konsisten menghemat banyak waktu diskusi tim.",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: bobPost1.id,
      user_id: eva.id,
      content:
        "Dari sisi PM, design system yang solid sangat membantu saat sprint planning 👍",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: bobPost1.id,
      user_id: clara.id,
      parent_comment_id: comment3.id,
      content:
        "Betul! Di tim saya dulu tanpa design system, CSS-nya chaos banget 😅",
    },
  });

  // Comments on Bob's post 2
  const comment4 = await prisma.comment.create({
    data: {
      post_id: bobPost2.id,
      user_id: alice.id,
      content:
        "Figma definitely. Kolaborasi real-time-nya unbeatable untuk tim remote.",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: bobPost2.id,
      user_id: david.id,
      content:
        "Sketch masih oke jika tim-nya pure Mac. Tapi Figma lebih fleksibel overall.",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: bobPost2.id,
      user_id: bob.id,
      parent_comment_id: comment4.id,
      content:
        "Setuju, real-time collaboration Figma memang killer feature-nya 💯",
    },
  });

  // Comments on Clara's post 2
  await prisma.comment.create({
    data: {
      post_id: claraPost2.id,
      user_id: alice.id,
      content:
        "Polars syntax-nya lebih mirip SQL ya? Jadi lebih mudah dipelajari.",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: claraPost2.id,
      user_id: david.id,
      content:
        "Coba benchmark Polars vs DuckDB juga Clara, hasilnya mengejutkan!",
    },
  });

  // Comments on David's post
  await prisma.comment.create({
    data: {
      post_id: davidPost1.id,
      user_id: alice.id,
      content:
        "Documentation is love. Sering diabaikan tapi sangat krusial untuk sustainability project.",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: davidPost1.id,
      user_id: eva.id,
      content:
        "Empathy for contributors itu penting banget. Good first issue yang jelas sangat membantu newcomer.",
    },
  });

  // Comments on Eva's post
  await prisma.comment.create({
    data: {
      post_id: evaPost1.id,
      user_id: alice.id,
      content: "Excited juga nih! Ada fitur yang bisa di-preview dulu tidak?",
    },
  });

  await prisma.comment.create({
    data: {
      post_id: evaPost1.id,
      user_id: bob.id,
      content:
        "Semangat! Kalau butuh mockup untuk fitur barunya, reach out ya 🎨",
    },
  });

  const totalComments = await prisma.comment.count();
  console.log(`✅ Created ${totalComments} comments (including replies)`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("─────────────────────────────────");
  console.log(`👤 Users     : ${users.length}`);
  console.log(`📝 Posts     : ${posts.length}`);
  console.log(`❤️  Likes     : ${likes.length}`);
  console.log(`💬 Comments  : ${totalComments}`);
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
