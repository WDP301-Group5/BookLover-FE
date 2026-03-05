import { Container, Grid, Title } from "@mantine/core";
import { useState } from "react";
import RequireLoginModal from "../../components/RequireLoginModal";
import VipPlanCard from "../../components/vip-plan/VipPlanCard";
import { useSubcriptionPlans } from "../../hooks/useSubcription";
import { useUserStore } from "../../stores/useUserStore";

interface ISubcriptionPlan {
	id: string;
	name: string;
	level: number;
	features: string[];
	description: string;
	spiritStones: number;
	extendedTime: string;
	soldCount?: number;
	status: "active" | "inactive" | "pending" | "current"; // current là gói vip hiện tại của user
	createdAt?: Date;
	updatedAt?: Date;
}

const BuyVipPlanPage = () => {
	const [loginNotice, setLoginNotice] = useState(false);

	const { data: subcriptionPlans } = useSubcriptionPlans();
	const userStore = useUserStore();
	const currentVipLevel = userStore.user?.vipLevel || 0;

	subcriptionPlans?.map((plan: ISubcriptionPlan) => {
		if (plan.level === currentVipLevel) {
			plan.status = "current";
		}
	});

	const onBuyPlan = (planId: string) => {
		if (!userStore.isLoggedIn) {
			setLoginNotice(true);
			return;
		}
		console.log("Click buy and logged in", planId);
		// TODO: thực hiện chức năng mua gói vip
	};

	return (
		<Container size="lg" py="xl">
			<Title mb="lg">Các gói vip</Title>
			<Grid>
				{(subcriptionPlans as ISubcriptionPlan[])?.map((plan) => (
					<Grid.Col key={plan.id} span={{ base: 12, sm: 6, md: 4 }}>
						<VipPlanCard
							onBuy={() => onBuyPlan(plan.id)}
							plan={plan as ISubcriptionPlan}
						/>
					</Grid.Col>
				))}
			</Grid>
			<RequireLoginModal
				opened={loginNotice}
				onClose={() => {
					setLoginNotice(false);
				}}
				title="Phiên đăng nhập đã hết hạn."
				message="Bạn vui lòng đăng nhập lại để thực hiện chức năng này."
			/>
		</Container>
	);
};

export default BuyVipPlanPage;
