import Menu from '../components/menu';
import Title from '../components/title';
import styles from '../styles/About.module.css';
export default function About({ journeys }) {
  const words = [
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla placeat aliquid dolorum magni necessitatibus possimus! Corporis ex commodi autem corrupti cum iste placeat, maxime beatae dolorum quidem expedita! Aut exercitationem tenetur quia ullam voluptatem, quaerat doloremque unde accusantium? Doloremque eius, eum, culpa deleniti nostrum voluptatem, excepturi libero eaque praesentium molestiae alias exercitationem. Delectus molestiae libero eligendi explicabo ex et aliquid saepe? Perferendis provident aperiam illo reiciendis, inventore corporis nulla sunt incidunt expedita dolorem modi odio distinctio beatae aspernatur, suscipit pariatur, dicta eius voluptas quidem laboriosam tenetur soluta sequi. Nostrum accusamus voluptates animi cupiditate sunt delectus reiciendis error tempore accusantium ipsum.',
  ];

  const credits =
    'Data analysis, visualization, website deisgn, and development, Sarah Williams, Director';

  return (
    <>
      <Menu />
      <Title />
      <div className={styles.aboutContainer}>
        <div className={styles.menu}></div>
        <div className={styles.sections}>
          <AboutSection title={'Project Description'} body={words[0]} />
          <AboutSection title={'Related Reports'}>
            <ul>
              <li>Irregular Migration in Libya[Case Study]</li>
              <li>Irregular Migration in Libya[Case Study]</li>
            </ul>
          </AboutSection>
          <AboutSection title={'Data Sources'}>
            <ul>
              <li>IFPRI</li>
              <li>IOM</li>
              <li>Mixed Migration</li>
            </ul>
          </AboutSection>
          <AboutSection title={'Credits'} body={credits}>
            <h4>Civic Data Design lab</h4>
          </AboutSection>
        </div>
      </div>
    </>
  );
}

function AboutSection({ title, body, children }) {
  return (
    <>
      <div className={styles.aboutSection}>
        <h3>{title}</h3>
        {children}
        <p>{body}</p>
      </div>
    </>
  );
}
