import Link from 'next/link';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { notFound } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import Markdown from 'react-markdown';
import styles from './page.module.scss';

export const metadata = {
  title: 'Spurningakerfi Jakobs',
};

const query = graphql(
  /* GraphQL */ `
    query Question($id: ItemId!) {
      question(filter: { id: { eq: $id } }) {
        questiontitle
        id
        spurning
        flokkur {
          title
          id
        }
      }
    }
  `,
  [],
);

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  revalidateTag('datocms');

  const { id } = await params;
  const { question } = await executeQuery(query, { variables: { id } });

  if (!question) {
    notFound();
  }

  return (
    <>
      <div>
        <h3 className={styles.title}>{question.questiontitle}</h3>
        <div>
          <Markdown>{question.spurning}</Markdown>
        </div>
        <p>Flokkur: {question.flokkur.title}</p>

        <Link href="/questions">Til baka.</Link>
      </div>
    </>
  );
}
