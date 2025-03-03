import React, { useState } from 'react';
import { BarChart2, BookOpen, List, Award, Settings, ChevronLeft, ChevronRight, Check, X, RefreshCw, Clock, Heart, GitBranch, Target, Zap, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';

// Sample data
const subjectStats = [
  { subject: "Biology", mastery: 76, weak: ["Cell Division", "Photosynthesis"], strong: ["Genetics", "Anatomy"] },
  { subject: "History", mastery: 62, weak: ["European History", "Industrial Revolution"], strong: ["Ancient Rome", "World War II"] },
  { subject: "Mathematics", mastery: 48, weak: