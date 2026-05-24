import {
  SkeletonHero,
  SkeletonControls,
  SkeletonGrid,
} from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <SkeletonHero />
      <SkeletonControls />
      <SkeletonGrid count={16} />
    </>
  );
}
