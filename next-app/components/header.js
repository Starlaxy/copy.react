

function Header({posts}) {
  return <>
  {console.log(posts)}
  {posts.map((post) => (
      <ul>
      <li>{post.title}</li>
      <li>{post.description}</li>
      <li>{post.created_at}</li>
      </ul>
      ))}
      
      
</>;
}

export async function getStaticProps() {
  const res = await fetch("http://127.0.0.1:8000/project/");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}

export default Header;
