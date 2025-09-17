import { useNavigate } from 'react-router-dom';
import { growthCourses } from './courseData';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useScrollReset } from '@/hooks/useScrollReset';

const CoursesPage = () => {
  const navigate = useNavigate();
  
  // Reset scroll position when component mounts
  useScrollReset();

  return (
    <div className="page-shell bg-gradient-healing p-6 flex flex-col transition-all duration-700">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="display-section text-primary-foreground text-3xl sm:text-5xl font-extrabold">Courses</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/growth')}
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
          <p className="page-subtitle text-primary-foreground/90 max-w-2xl mb-12 font-medium">
            Choose the modules that resonate with you. Add what supports your journey now—return anytime for more.
          </p>

          <div className="grid gap-10 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
            {growthCourses.map(course => (
              <div
                key={course.id}
                className="group rounded-3xl overflow-hidden bg-white shadow-soft hover:shadow-glow transition-gentle flex flex-col border border-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-300/40"
                onClick={() => navigate(`/growth/${course.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/growth/${course.id}`); }}
              >
                {/* Image */}
                <div className="relative h-72 w-full overflow-hidden md:h-80 xl:h-72">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="font-semibold text-xl text-white drop-shadow mb-1">{course.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[13px] text-gray-700 mb-4 line-clamp-3 leading-relaxed">{course.description.split('\n')[0]}</p>
                  <p className="text-xs font-medium text-gray-600 mb-5">{course.details}</p>

                  {/* Tags */}
                  {course.tags && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {course.tags.slice(0,3).map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full text-[11px] bg-primary/10 text-primary font-semibold border border-primary/25"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-[11px] bg-primary/10 text-primary font-medium border border-primary/20">+{course.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Placeholder card */}
            <div className="rounded-3xl border-2 border-dashed border-border bg-white flex items-center justify-center min-h-[360px] text-muted-foreground text-sm font-medium shadow-soft">
              More courses coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
