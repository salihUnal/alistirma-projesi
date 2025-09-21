import React, { useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  type: string;
  isRead: boolean;
  addedAt: Date;
};

// type BookListProps
