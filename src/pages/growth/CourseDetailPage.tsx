import { useParams, useNavigate } from 'react-router-dom';
import { growthCourses } from './courseData';
import { X, ArrowLeft } from 'lucide-react';
import { useScrollReset } from '@/hooks/useScrollReset';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = growthCourses.find(c => c.id === courseId);
  
  // Reset scroll position when component mounts
  useScrollReset();

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background text-center">
        <div className="max-w-md bg-white rounded-2xl p-8 shadow-soft border border-border">
          <p className="mb-6 font-semibold text-foreground">Course not found.</p>
          <button
            onClick={() => navigate('/growth/courses')}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-soft hover:shadow-glow transition-gentle"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const firstParagraph = course.description.split('\n')[0];
  const restDescription = course.description.split('\n').slice(1).join('\n').trim();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-calm text-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-8 bg-white border-b border-border shadow-soft">
        <button
          onClick={() => navigate('/growth/courses')}
          className="inline-flex items-center gap-2 text-foreground hover:text-primary text-sm font-medium rounded-full px-4 py-2 bg-muted/40 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Back</span>
        </button>
        <button
          onClick={() => navigate('/growth/courses')}
          className="p-2 rounded-full text-foreground hover:text-primary hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-16 sm:px-8">
        <div className="max-w-6xl mx-auto pt-6">
          {/* Hero */}
          <div className="rounded-3xl overflow-hidden shadow-soft border border-border bg-white mb-10">
            <div className="h-[340px] sm:h-[420px] w-full relative">
              <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow mb-4 leading-tight">
                  {course.title}
                </h1>
                <p className="text-white/90 text-sm sm:text-lg max-w-3xl leading-relaxed font-medium whitespace-pre-line">
                  {firstParagraph}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {/* Main Sections */}
            <div className="md:col-span-2 space-y-10">
              {!!restDescription && (
                <section className="bg-white rounded-2xl p-8 shadow-soft border border-border">
                  <h2 className="text-xl font-semibold mb-4 tracking-tight">Course Overview</h2>
                  <div className="text-foreground/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {restDescription}
                  </div>
                </section>
              )}

              <section className="bg-white rounded-2xl p-8 shadow-soft border border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70 mb-3">Structure</h3>
                <p className="text-foreground/80 text-sm sm:text-base font-medium leading-relaxed">
                  {course.details}
                </p>
              </section>

              <section className="bg-white rounded-2xl p-8 shadow-soft border border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70 mb-3">What You'll Gain</h3>
                <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-sm leading-relaxed">
                  <li>Foundational understanding through guided modules</li>
                  <li>Progressive skill-building & reflective integration</li>
                  <li>Confidence in expressive & interpersonal communication</li>
                  <li>Meaningful application in real-world contexts</li>
                </ul>
              </section>

              <section className="bg-white rounded-2xl p-8 shadow-soft border border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70 mb-3">Notes</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Future iterations will include dynamic module progression, saved milestones, journaling prompts, and activity tracking to deepen engagement and reinforce applied learning.
                </p>
              </section>
            </div>

            {/* Side / Meta */}
            <div className="md:col-span-1 space-y-8">
              {course.tags && (
                <section className="rounded-2xl bg-white border border-border p-6 shadow-soft">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70 mb-4">At a Glance</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-[11px] bg-primary/10 text-primary font-medium border border-primary/25"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-2xl bg-white border border-border p-6 shadow-soft">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70 mb-4">Format</h3>
                <ul className="space-y-3 text-foreground/80 text-sm leading-relaxed">
                  <li className="flex gap-2"><span className="text-foreground/50">•</span> Modular micro-learning blocks</li>
                  <li className="flex gap-2"><span className="text-foreground/50">•</span> Activity-based reinforcement</li>
                  <li className="flex gap-2"><span className="text-foreground/50">•</span> Multi-modal media (audio / visual)</li>
                  <li className="flex gap-2"><span className="text-foreground/50">•</span> Reflective integration prompts (coming soon)</li>
                </ul>
              </section>
            </div>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
