import { Container, Grid, Title } from '@mantine/core';
import VipPlanCard from '../../components/vip-plan/VipPlanCard';
import { useSubcriptionPlans } from '../../hooks/useSubcription';
import { useUserStore } from '../../stores/useUserStore';

interface ISubcriptionPlan {
    id: string;
    name: string;
    level: number;
    features: string[];
    description: string;
    spiritStones: number;
    extendedTime: string;
    soldCount?: number;
    status: "active" | "inactive" | "pending" | "current";// current là gói vip hiện tại của user
    createdAt?: Date;
    updatedAt?: Date;
}

const BuyVipPlanPage = () => {
    
    const {data: subcriptionPlans} = useSubcriptionPlans();
    const userStore = useUserStore();
    const currentVipLevel = userStore.user?.vipLevel || 4;

    subcriptionPlans?.map((plan: ISubcriptionPlan) => {
        if(plan.level === currentVipLevel) {
            plan.status = "current";
        }
    })

    return (
        <Container size="lg" py="xl">
            <Title mb="lg">Các gói vip</Title>
            <Grid>
                {(subcriptionPlans as ISubcriptionPlan[])?.map((plan) => (
                    <Grid.Col key={plan.id} span={{ base: 12, sm: 6, md: 4 }}>
                        <VipPlanCard plan={plan as ISubcriptionPlan} />
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    );
};

export default BuyVipPlanPage;