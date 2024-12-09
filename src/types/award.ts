export interface Award {
  title: string;           // 奖项名称
  summary: string;         // 奖项简介
  category_level1: string; // 一级学科分类
  category_level2: string; // 二级学科分类
  organization: string;    // 颁奖机构
  url: string;            // 外部链接
  pageviews: number;      // 页面访问量
  [key: string]: any;
} 