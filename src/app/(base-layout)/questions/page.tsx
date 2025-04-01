import Link from 'next/link';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { notFound } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import styles from './page.module.scss';

export const metadata = {
  title: 'Spurningakerfi Jakobs',
};

const query = graphql(
  /* GraphQL */ `
    query Questions {
      allQuestions {
        questiontitle
        id
      }
    }
  `,
  [],
);

export default async function QuestionsPage() {
  revalidateTag('datocms');
  const { allQuestions } = await executeQuery(query, {});

  if (!allQuestions) {
    notFound();
  }
  return (
    <>
      <h3 className={styles.title}>Spurningar í boði</h3>

      <ul>
        {allQuestions.map((question) => (
          <li key={question.id}>
            <Link href={`/questions/${question.id}`}>{question.questiontitle}</Link>
          </li>
        ))}
      </ul>
      <Link href="/">Til baka</Link>
    </>
  );
}
