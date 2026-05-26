export const CHART_THEME = {
  card: {
    background: '#ffffff',
    border: '#e5e7eb',
    shadow: '0 8px 24px rgba(15, 23, 42, 0.055)',
  },

  text: {
    title: '#111827',
    primary: '#374151',
    secondary: '#6b7280',
    muted: '#9ca3af',
  },

  axis: {
    grid: '#e5e7eb',
    line: '#cbd5e1',
  },

  /**
   * 条形图：
   * 保留蓝色的专业感，但不用高饱和亮蓝。
   * 用半透明渐变，让视觉不刺眼。
   */
  bar: {
    track: '#f1f5f9',
    start: 'rgba(59, 130, 246, 0.48)',
    end: 'rgba(37, 99, 235, 0.72)',
  },

  /**
   * 折线图：
   * 使用柔和蓝紫，不再是纯蓝。
   */
  line: {
    stroke: 'rgba(79, 70, 229, 0.78)',
    point: 'rgba(79, 70, 229, 0.9)',
    area: 'rgba(99, 102, 241, 0.12)',
  },

  pie: {
    border: '#f8fafc',
    center: '#ffffff',
  },

  // 降低透明度、避免纯色高对比，柔和但不冷清：
  palette: [
    'rgba(59, 130, 246, 0.72)',  // 柔和蓝
    'rgba(20, 184, 166, 0.68)',  // 青绿色，但不刺眼
    'rgba(139, 92, 246, 0.68)',  // 紫色
    'rgba(249, 115, 22, 0.62)',  // 柔和橙
    'rgba(236, 72, 153, 0.58)',  // 玫红，低透明度
    'rgba(245, 158, 11, 0.62)',  // 琥珀
    'rgba(14, 165, 233, 0.62)',  // 天蓝
    'rgba(100, 116, 139, 0.62)', // 灰蓝兜底
  ],
}
