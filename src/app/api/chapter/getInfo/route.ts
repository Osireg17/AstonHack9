import { NextResponse} from "next/server";

const sleep =  async () =>
    new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

export async function POST(req: Request, res: Response) {
    try {
        await sleep();
        return NextResponse.json({message: "Success"});
    } catch (e) {
        return NextResponse.error();
    }
}