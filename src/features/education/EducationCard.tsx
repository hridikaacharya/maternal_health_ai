type Lesson = {
  type: string;
  title: string;
  content?: string;
  items?: string[];
};

type EducationModule = {
  id: string;
  title: string;
  category: string;
  lessons: Lesson[];
};

export function EducationCard({
  module,
}: {
  module: EducationModule;
}) {
  return (
    <div className="education-card">

      <h2>{module.title}</h2>

      <p className="category">
        {module.category}
      </p>

      {module.lessons.map((lesson) => (
        <div key={lesson.title}>

          <h3>
            {lesson.title}
          </h3>

          {lesson.content && (
            <p>
              {lesson.content}
            </p>
          )}

          {lesson.items && (
            <ul>
              {lesson.items.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          )}

        </div>
      ))}

    </div>
  );
}