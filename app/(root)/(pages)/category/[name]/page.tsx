import { redirect } from "next/navigation";
import { CategoryPageComponent } from "./content";
import { CheckRankRequirement } from "@/lib/actions/category.actions";
import { Metadata } from "next";
import { unslug } from "@/lib/slugify";

export const generateMetadata = async ({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> => {
  return {
    title: unslug(params.name),
  };
};

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
