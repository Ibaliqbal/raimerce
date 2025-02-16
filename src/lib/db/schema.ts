import { TMedia, VariantSchemaT } from "@/types/product";
import { DiscountSchemaT } from "@/types/promo";
import { Address } from "@/types/user";
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  customType,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["admin", "member"]);
export const TypeLogin = pgEnum("typeLogin", ["google", "credentials"]);
export const StatusOrder = pgEnum("statusOrder", [
  "pending",
  "canceled",
  "success",
]);
export const NotificationType = pgEnum("notificationType", [
  "report_to_store",
  "order_client",
  "order_store",
  "report_to_system",
  "result_report_to_client",
]);

export const tsVector = customType<{
  data: string;
  config: {
    sources: string[];
  };
}>({
  dataType(config) {
    if (config) {
      const sources = config.sources.join(" || ' ' || ");
      return `tsvector generated always as (to_tsvector('english', ${sources})) stored`;
    } else {
      return "tsvector";
    }
  },
});

export const CategoryProduct = pgEnum("categoryProduct", [
  "Fashion",
  "Electronic",
  "Skincare",
  "Foods",
  "Furnitures",
  "Sports",
  "Otomotif",
]);

export const UsersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).default(""),
    avatar: jsonb("avatar").$type<TMedia>(),
    role: UserRole("role").default("member").notNull(),
    typeLogin: TypeLogin("type_login").default("credentials"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    phone: varchar("phone", { length: 255 }),
    address: jsonb("address").$type<Address>(),
    nonActive: boolean("non_active").default(false).notNull(),
  },
  (table) => {
    return {
      idIndex: index("idUserIndex").on(table.id),
      nonActiveUser: index("nonActiveUser").on(table.nonActive),
    };
  }
);

export const StoresTable = pgTable(
  "stores",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    description: text().default(""),
    headerPhoto: jsonb("headerPhoto").$type<TMedia>(),
    address: jsonb("address").$type<Address>(),
    userId: uuid("user_id")
      .references(() => UsersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    nonActive: boolean("non_active").default(false).notNull(),
  },
  (table) => {
    return {
      idIndex: index("idStoreIndex").on(table.id),
      nameIndex: index("nameStoreIndex").on(table.name),
      ownerIndex: index("ownerStoreIndex").on(table.userId),
      nonActiveStore: index("nonActiveStore").on(table.nonActive),
    };
  }
);

export const PromoTable = pgTable(
  "promo",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    code: varchar("code", { length: 255 }).unique().notNull(),
    amount: integer("amount").default(0).notNull(),
    uses: bigint("uses", { mode: "number" }).default(0).notNull(),
    productsAllowed: jsonb("allow_products")
      .array()
      .default(sql`ARRAY[]::jsonb[]`)
      .$type<Array<string>>(),
    createdAt: timestamp("created_at").defaultNow(),
    expiredAt: date("expired_at").notNull().defaultNow(),
    ownerId: uuid("owner_id")
      .references(() => StoresTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (table) => {
    return {
      idIndex: index("idPromoIndex").on(table.id),
      codeIndex: index("codePromoIndex").on(table.code),
    };
  }
);

export const ProductsTable = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    storeId: uuid("store_id")
      .references(() => StoresTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").default("").notNull(),
    variant: jsonb("variant")
      .array()
      .notNull()
      .default(sql`ARRAY[]::jsonb[]`)
      .$type<Array<VariantSchemaT>>(),
    rating: numeric("rating", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    category: CategoryProduct("category").default("Fashion").notNull(),
    soldout: bigint("soldout", { mode: "number" }).default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      idIndex: index("idProductIndex").on(table.id),
      storeIdIndex: index("storeIdProductIndex").on(table.storeId),
      nameIndex: index("nameProductIndex").on(table.name),
      categoryIndex: index("categoryProductIndex").on(table.category),
      ratingIndex: index("ratingProductIndex").on(table.rating),
    };
  }
);

export const CartsTable = pgTable(
  "carts",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => UsersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    produtId: uuid("produt_id")
      .references(() => ProductsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    variant: varchar("variant", { length: 255 }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    isCheckout: boolean("is_checkout").default(false).notNull(),
    category: varchar("category", { length: 255 }).default(""),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      idIndex: index("idCartIndex").on(table.id),
      userIdIndex: index("userIdCartIndex").on(table.userId),
      productIdIndex: index("productIdCartIndex").on(table.produtId),
      checkoutIndex: index("checkoutIndex").on(table.isCheckout),
      variantIndex: index("variantIndex").on(table.variant),
    };
  }
);

export const OrdersTable = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => UsersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    transactionCode: varchar("transaction_code", { length: 255 }).notNull(),
    products: jsonb("products_order")
      .array()
      .default(sql`ARRAY[]::jsonb[]`)
      .$type<
        Array<{
          variant: string;
          category: string | null;
          quantity: number;
          productID: string | undefined;
          productName: string | undefined;
          productVariant: VariantSchemaT | undefined;
          status: "confirmed" | "received" | "not-confirmed";
        }>
      >(),
    status: StatusOrder("status").default("pending"),
    promoCodes: jsonb("promo_codes")
      .array()
      .default(sql`ARRAY[]::jsonb[]`)
      .$type<Array<DiscountSchemaT>>(),
    storeIds: jsonb("store_ids")
      .array()
      .default(sql`ARRAY[]::jsonb[]`)
      .$type<Array<string>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    paymentMethod: varchar("payment_method", { length: 255 }).notNull(),
    productsID: jsonb("products_id")
      .array()
      .default(sql`ARRAY[]::jsonb[]`)
      .$type<Array<string>>(),
    vaNumber: varchar("va_number", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      idIndex: index("idOrderIndex").on(table.id),
      userIdIndex: index("userIdOrderIndex").on(table.userId),
      storeIdsIndex: index("storeIdsOrderIndex").on(table.storeIds),
      transactionCodeIndex: index("transactionCodeIndex").on(
        table.transactionCode
      ),
    };
  }
);

export const NewsTable = pgTable(
  "news",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    content: text().default(""),
    medias: jsonb("medias")
      .array()
      .default(sql`ARRAY[]::jsonb[]`)
      .$type<Array<TMedia>>(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    storeId: uuid("store_id")
      .references(() => StoresTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (table) => {
    return {
      idIndex: index("idNewsIndex").on(table.id),
    };
  }
);

export const CommentsTable = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .references(() => UsersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => ProductsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  content: text().default(""),
  variant: varchar("variant", { length: 256 }),
  rating: numeric("rating", { scale: 2, precision: 10 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  medias: jsonb("medias")
    .array()
    .default(sql`ARRAY[]::jsonb[]`)
    .$type<Array<TMedia>>(),
});

export const FollowTable = pgTable(
  "follow",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => UsersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    storeId: uuid("store_id")
      .references(() => StoresTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      storeIdIndex: index("storeIdIndex").on(table.storeId),
    };
  }
);

export const NotificationTable = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => UsersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: NotificationType("type").default("order_client").notNull(),
    content: text().default("").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    typeIndex: index("typeIndex").on(table.type),
  })
);

// All relation table
export const userRelation = relations(UsersTable, ({ one, many }) => ({
  store: one(StoresTable, {
    fields: [UsersTable.id], // Ensure this references the correct column
    references: [StoresTable.userId],
  }),
  followings: many(FollowTable),
  carts: many(CartsTable),
  orders: many(OrdersTable),
  comments: many(CommentsTable),
  nofitications: many(NotificationTable),
}));

export const storeRelation = relations(StoresTable, ({ one, many }) => ({
  owner: one(UsersTable, {
    fields: [StoresTable.userId],
    references: [UsersTable.id],
  }),
  followers: many(FollowTable),
  products: many(ProductsTable),
  news: many(NewsTable),
  promos: many(PromoTable),
}));

export const productRelation = relations(ProductsTable, ({ one, many }) => ({
  store: one(StoresTable, {
    fields: [ProductsTable.storeId],
    references: [StoresTable.id],
  }),
  comments: many(CommentsTable),
}));

export const cartRelation = relations(CartsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [CartsTable.userId],
    references: [UsersTable.id],
  }),
  product: one(ProductsTable, {
    fields: [CartsTable.produtId],
    references: [ProductsTable.id],
  }),
}));

export const orderRelation = relations(OrdersTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [OrdersTable.userId],
    references: [UsersTable.id],
  }),
}));

export const newsRelation = relations(NewsTable, ({ one }) => ({
  store: one(StoresTable, {
    fields: [NewsTable.storeId],
    references: [StoresTable.id],
  }),
}));

export const promoRelation = relations(PromoTable, ({ one }) => ({
  owner: one(StoresTable, {
    fields: [PromoTable.ownerId],
    references: [StoresTable.id],
  }),
}));

export const commentsRelation = relations(CommentsTable, ({ one }) => ({
  product: one(ProductsTable, {
    fields: [CommentsTable.productId],
    references: [ProductsTable.id],
  }),
  user: one(UsersTable, {
    fields: [CommentsTable.userId],
    references: [UsersTable.id],
  }),
}));

export const followRelation = relations(FollowTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [FollowTable.userId],
    references: [UsersTable.id],
  }),
  store: one(StoresTable, {
    fields: [FollowTable.storeId],
    references: [StoresTable.id],
  }),
}));

export const notificationRleation = relations(NotificationTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [NotificationTable.userId],
    references: [UsersTable.id],
  }),
}));

// All type
export type TUser = typeof UsersTable.$inferSelect;
export type TUserInsert = typeof UsersTable.$inferInsert;
export type TProducts = typeof ProductsTable.$inferSelect;
export type TStore = typeof StoresTable.$inferSelect;
export type TCart = typeof CartsTable.$inferSelect;
export type TOrder = typeof OrdersTable.$inferSelect;
export type TPromo = typeof PromoTable.$inferSelect;
export type TNews = typeof NewsTable.$inferSelect;
export type TComment = typeof CommentsTable.$inferSelect;
export type TFollow = typeof FollowTable.$inferSelect;
export type TNotification = typeof NotificationTable.$inferSelect;
