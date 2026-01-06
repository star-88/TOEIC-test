// @ts-nocheck
import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  Plus, 
  ChevronLeft, 
  Volume2, 
  MoreHorizontal, 
  Search,
  Folder,
  X
} from 'lucide-react';

// Expose to global namespace
window.TOEIC = window.TOEIC || {};
window.TOEIC.Icons = {
  Book: BookOpen,
  Pen: PenTool,
  Plus: Plus,
  Back: ChevronLeft,
  Speaker: Volume2,
  More: MoreHorizontal,
  Search: Search,
  Folder: Folder,
  Close: X
};