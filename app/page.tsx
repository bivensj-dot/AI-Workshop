export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <header className="hero">
        <h1>James</h1>
        <p className="tagline">a junior at UH Manoa studying political science.</p>
      </header>

      <main>
        <section className="section">
          <h2>About</h2>
          <p>
            James is a junior at the University of Hawaii at Manoa, where he studies
            political science with an interest in how policy and public institutions
            shape everyday life. Outside the classroom, he enjoys following current
            events, getting involved on campus, and exploring the islands.
          </p>
        </section>

        <section className="section">
          <h2>This semester</h2>
          <p className="placeholder-note">
            (Placeholder — James will update this with what he&apos;s actually doing.)
          </p>
          <ul>
            <li>Coursework: Comparative Politics and International Relations</li>
            <li>Internship: State Legislature or a local nonprofit policy office</li>
            <li>Involvement: Undergraduate Political Science Association</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>
          James &copy; {year}
        </p>
      </footer>
    </>
  );
}
