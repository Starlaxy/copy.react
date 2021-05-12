import Header from "../components/header";
import { useAuth } from "../util/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
function Home({ posts }) {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Update the document title using the browser API
        {
            auth.user ? <></> : router.push("/signin");
        }
    });
    return (
        <>
            {auth.user ? (
                <>
                    <p>Hello {auth.user}</p>
                    {posts.map((post) => (
                        <ul>
                            <li>{post.title}</li>
                            <li>{post.description}</li>
                            <li>{post.created_at}</li>
                        </ul>
                    ))}
                </>
            ) : (
                <></>
            )}
        </>
    );
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

export default Home;

// import ProjectItem from "../components/projectItem";
// import { getProject } from "./api/project";

// function ProjectList ({ projects })  {
// //    const projects = await getProject()
// //     .then((projects) => {
// //       console.log(projects);
// //     })
// //     .catch((e) => {
// //       throw new Error(e);
// //     });

//   console.log(projects);

//   return (
//     <>
//       {projects.map((project) => (
//         <p>{project.title}</p>
//       ))}
//       {/* <div>hogehoge</div> */}
//     </>
//   );
// };

// export async function getStaticProps() {
// //   const res = await fetch("http://127.0.0.1:8000/project/");
// //   const projects = await res.json();
// //   return {
// //     props: {
// //       projects,
// //     },
// //   };
//   const projects = await getProject()
//     // .then((projects) => {
//     //   return {
//     //     props: {
//     //       projects,
//     //     },
//     //   };
//     // })
//     .catch((e) => {
//       throw new Error(e);
//     })

//     return {
//         props: {
//           projects,
//         },
//       };
// }

// export default ProjectList;
