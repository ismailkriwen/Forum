import { redirect } from "next/navigation";
import { CategoryPageComponent } from "./content";
import { CheckRankRequirement } from "@/lib/actions/category.actions";

const CategoryNamePage = async ({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const checkRankRequirement = await CheckRankRequirement({
    name: params.name,
  });
  if (!checkRankRequirement) redirect("/");
  if (!searchParams.page) redirect("?page=1");

  return (
    <>
      <CategoryPageComponent params={params} searchParams={searchParams} />
    </>
  );
};

export default CategoryNamePage;
