import { courses as mockCourses, mockSubmissions } from '../../mocks/data';
import { useViewStore } from '../../store/view';
import { useFilterStore } from '../../store/filters';
import { cn } from '../../lib/utils';

export const CourseSidebar = () => {
  // Assuming activeCourseFilter comes from a store or local state
  // For now I'll use a local mock or check store
  const activeCourseFilter = 'all'; 
  const setCourseFilter = (id: string) => {};

  const counts = mockCourses.map((c) => ({
    ...c,
    flagged: mockSubmissions.filter(
      (s) => s.courseId === c.id && s.riskLevel === 'high'
    ).length,
    medium: mockSubmissions.filter(
      (s) => s.courseId === c.id && s.riskLevel === 'medium'
    ).length,
  }));

  return (
    <aside className="w-56 shrink-0 bg-surface border-r-0.5 border-border flex flex-col py-6 overflow-y-auto">
      <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4">Courses</p>

      <div className="space-y-1 px-3">
        <button
          onClick={() => setCourseFilter('all')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-md',
            activeCourseFilter === 'all'
              ? 'bg-brand-light text-brand'
              : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
          )}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-text-muted opacity-40 shrink-0" />
          <span className="flex-1 text-left">All courses</span>
        </button>

        {counts.map((course) => (
          <button
            key={course.id}
            onClick={() => setCourseFilter(course.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-sm font-bold transition-all rounded-md group',
              activeCourseFilter === course.id
                ? 'bg-brand-light text-brand'
                : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
            )}
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              course.flagged > 0 ? "bg-risk-high" : course.medium > 0 ? "bg-risk-medium" : "bg-risk-low"
            )} />
            <span className="flex-1 truncate text-left">{course.name}</span>
            {course.flagged > 0 && (
              <span className="text-[10px] font-mono font-bold bg-risk-high-bg text-risk-high px-1.5 py-0.5 rounded-md border-0.5 border-risk-high/10">
                {course.flagged}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};
